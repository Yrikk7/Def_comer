const User = require("./models/User")
const Role = require("./models/Role")
const Storage = require("./models/Storage")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { secret } = require("./config")
const { validationResult } = require('express-validator')
const config = require("./default")
const { access } = require("fs")
const key = Buffer.from(config.KEY, "hex");
const iv = Buffer.from(config.IV, "hex");

const generateAccesToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "ошибка при регистрации" })
            }
            const { username, password, role } = req.body
            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(400).json({ message: "user with same name is done" })
            }
            const hashpassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: role })
            const user = new User({ username, password: hashpassword, roles: [userRole.value] })
            await user.save()
            return res.json({ message: "User sing in succesful" })
        }
        catch (e) {
            console.log(e)
            res.status(400).json({ message: "Reqistration error" })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({ message: `Пользователь с ${username} не найден` })
            }
            const validpassword = await bcrypt.compareSync(password, user.password)
            if (!validpassword) {
                return res.status(400).json({ message: `Пароль с ${password} не верный` })
            }
            const token = generateAccesToken(user._id, user.roles)
            return res.json({ token })
        }
        catch (e) {
            console.log(e)
            res.status(400).json({ message: "Reqistration error" })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        }
        catch (e) {

        }
    }

    async examinationRules(req, res) // проверка прав
    {
        try {
            let { target } = req.body;
            const kod = ["!", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"]
            const status = ["ADMIN", "SECURITY", "PERSONNEL", "SECRETARY",
                "MARKETING", "ACCOUNTING", "ACCOUNTING_V2", "ARCHIVE", "EQUIPMENT",
                "COMM_ENGINEERS", "ROCKET_ENGINEERS", "HIGH_ENGINEERS"]
            let marker = "";
            for (let i = 0; i < kod.length; i++) {
                if (target == status[i]) {
                    marker = kod[i]
                }
            }
            return marker
        }
        catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }

    async getListStorage(req, res) // для загрузки названий файлов
    {
        try {            
            const { target } = req.body;           
            const userMarker = await this.examinationRules({
                body: { target }
            });            
            const storages = await Storage.find({}, 'name ruleKod');            
            const storageNames = storages.map(storage => {
                const hasAccess = storage.ruleKod && storage.ruleKod.includes(userMarker);
                return hasAccess ? `ДОЗВОЛЕНО_${storage.name}` : storage.name;
            });
            return res.json(storageNames);
        }
        catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }

    async getContentStorage(req, res) // для содержимого выделеного файла 
    {
        try {            
            const { target } = req.body;            
            const userMarker = await this.examinationRules({
                body: { target }
            });
            if (req.params.name.includes("ДОЗВОЛЕНО_")) {
                req.params.name = req.params.name.replace("ДОЗВОЛЕНО_", "");
            }
            const selectStorage = await Storage.findOne({ name: req.params.name })            
            let data = selectStorage.content
            if ( selectStorage.ruleKod.includes(userMarker)) {
                data = this.getDecrypted(selectStorage.content);
                res.send(data);
            }
            else {
                return res.send(data);
            }
        }
        catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }

    async saveContentStorage(req, res) // для сохранения файла 
    {
        try {
            let { text, nameNewFile, roles } = req.body
            if (!text || !nameNewFile) {
                return res.status(400).json({ message: "Нет текста или имени файла" })
            }            
            await new Storage({ name: `${nameNewFile}.txt`, content: this.getEncrypted(text), ruleKod: roles }).save();
            res.json({ message: "Файл збережено" })
        }
        catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }


    getEncrypted(text) { 
        try {
            const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
            let encrypted = cipher.update(text, "utf8", "base64");
            encrypted += cipher.final("base64");
            return encrypted;
        } catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }

    getDecrypted(encryptedBase64) {
        try {
            const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
            let decrypted = decipher.update(encryptedBase64, "base64", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        } catch (error) {
            console.error("Decryption error:", error);
            throw error;
        }
    }

    async syncNewRole(req, res) {
        const security = new Storage();
        const personnel = new Storage();
        const secretary = new Storage();
        await security.save();
        await personnel.save();
        await secretary.save();
        return res.json({ message: "yep" })
    }
}

module.exports = new authController()