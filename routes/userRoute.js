const fs = require('fs');
const { join } = require('path');

const filePath = join(__dirname, 'users.json');

const getUsers = () => {
    const data = fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
        : []
    try {
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'));

const userRoute = (app) => {
    app.route('/users/:id?')
        .get((req, res) => {
            const users = getUsers();
            res.send({ users });
        })
        .post((req, res) => {
            const users = getUsers()
            users.push(req.body);
            saveUser(users);
            res.status(201).send('Usuário Criado');
        })
        .put((req, res) => {
            const users = getUsers();
            saveUser(users.map(user => {
                if (user.id === req.params.id) {
                    res.status(200).send('Usuário Alterado');
                    return {
                        ...user,
                        ...req.body
                    }
                }
                res.status(200).send('Usuário não existe');
                return user;
            }))
        })
        .delete((req, res) => {
            const users = getUsers();
            saveUser(users.filter(user => user.id !== req.params.id ));
            res.status(200).send('Usuário excluído');
        })
}

module.exports = userRoute;