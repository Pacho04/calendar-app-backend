const {Router} = require("express");
const { check } = require("express-validator");
const router = Router();

const { getEventos, eliminarEventos, crearEventos, actualizarEventos} = require("../controllers/events");
const { validarJWT } = require('../middlewares/validar-jwt');
const {validarCampos} = require('../middlewares/validar-campos');
const { isDate } = require("../helpers/isDate");


router.use(validarJWT);

router.get('/', getEventos);

router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha inicio es obligatoria').custom(isDate),
        check('end', 'Fecha finalizacion es obligatoria').custom(isDate),
        validarCampos
        
    ],
    crearEventos);

router.put('/:id', actualizarEventos);

router.delete('/:id', eliminarEventos);


module.exports = router;
 