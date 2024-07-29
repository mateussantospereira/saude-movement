// Validação local

function expiration (req, res, next) {
    const expires = (Date.parse(req.session.sess["_expires"]));
    
    if (expires < Date.now()) {
        return res.redirect("/validar");
    }

    return next();
};

class validePage {
    colaborador (req, res, next) {
        if (!req.session.sess) {
            return res.redirect("/validar");
        }
    
        return expiration(req, res, next);
    };
    
    rh (req, res, next) {
        if (req.session.sess) {
            if (
                req.session.sess.userType == "rh" ||
                req.session.sess.userType == "adm"
            ) {
                return expiration(req, res, next);
            }
        }

        console.log(req.session.sess)

        console.log("TESTE3")
    
        return res.redirect("/validar");
    };
    
    adm (req, res, next) {
        if (req.session.sess) {
            if (req.session.sess.userType == "adm") {
                return expiration(req, res, next);
            }
        }
    
        return res.redirect("/validar");
    };
}

module.exports = new validePage();