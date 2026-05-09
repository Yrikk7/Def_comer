const Router = require("express")
const controller = require("./authController")
const router = new Router()
const { check } = require('express-validator')
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')
const authController = require("./authController")

router.post('/registration', roleMiddleware(['ADMIN']), [check("username", "имя пользователя не может быть пустым ").notEmpty(),
check("password", "имя пользователя не может быть пустым ").isLength({ min: 4, max: 10 })

], controller.registration)
router.post('/login', controller.login)

router.get('/user', roleMiddleware(['ADMIN']), controller.getUsers)

router.get('/', (req, res) => {
    res.render("main")
})
router.get('/dashboard', (req, res) => {
    res.render("dashboard")
})
router.get('/dashboardAdmin', (req, res) => {
    res.render("dashboardAdmin")
})
router.get('/main', (req, res) => {
    res.render("main")
})

router.post('/files', controller.getListStorage.bind(controller))

router.post('/files/:name', controller.getContentStorage.bind(controller))

router.post('/save', controller.saveContentStorage.bind(controller))

router.get('/newRole', controller.syncNewRole)
module.exports = router