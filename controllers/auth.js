const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe el email'
            });
        }

        usuario = new Usuario(req.body)

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //TOKEN
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor se comunica con el tecnico'
        });
    }

}

const loginUsuario = async(req, res) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario con ese email'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La password no es correcta'
            })
        }

        //TOKEN
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            msg: 'login',
            uid: usuario.id,
            name: usuario.name,
            token
        });



    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor se comunica con el tecnico'
        });
    }
}

const revalidarToken = async(req, res) => {

    const uid = req.uid;
    const name = req.name;
    
    const token = await generarJWT(uid, name);
    
    res.json({
        ok: true,
        uid,
        name,
        token
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}