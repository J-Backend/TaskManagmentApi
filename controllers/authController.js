const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const login = async (req,res) => { 
    const {email, password} = req.body

    if(!email || !password ){
        return res.status(400).json({message:'All fields are required'})
    }

    const foundUser = await userModel.findOne({email}).exec()

    const match = await bcrypt.compare(password,foundUser.password)

    if(!match) return res.status(401).json({message:'Unauthorized'})

    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "email": foundUser.email
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'50s'}
    )

    const refreshToken = jwt.sign(
        {"email": foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'10m'}
    )
    console.log("\nrefreshToken loggin ", refreshToken)
    res.cookie('jwt', refreshToken,{
        httpOnly:true,
        // secure:true,
        sameSite:'None',
        maxAge: 7*24*60*60*1000
    })

    // console.log("res.cookie en loggin ", res.cookie)
    console.log("\naccessToken loggin ", accessToken)
    res.json({accessToken})

}

const refresh = (req, res) =>{
    const cookies = req.cookies

    console.log("\ncookies in refresh ", cookies)

    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt
    console.log("\nrefreshToken en refresh ", refreshToken)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err) return res.status(403).json({message:'Forbidden'})

            const foundUser = await userModel.findOne({email:decoded.email}).exec()

            if(!foundUser) return res.status(401).json({message:'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "email": foundUser.email,

                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'50s'}

            )
            res.json({accessToken})
        }
    )
}

const logout = (req, res) =>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', {
        httpOnly:true, 
        sameSite:'None', 
        // secure:true
    })
    res.json({message:'Cookie cleared'})
}

module.exports = {
    login,
    refresh,
    logout
}