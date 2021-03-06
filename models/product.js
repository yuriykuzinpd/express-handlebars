const fs        =   require('fs');
const path      =   require('path');
const { uuid }  =   require('uuidv4');

class Product
{
    constructor(title, price, img)
    {
        this.title  = title;
        this.price  = price;
        this.img    = img;
        this.id     = uuid();
    }

    static async getById(id) {
        const p = await Product.getAll()
        return p.find(c => c.id === id)
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'products.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(JSON.parse(content));
                    }
                }
            )
        });
    }

    async save() {
        const products = await Product.getAll()
        products.push(this.toJSON())

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'products.json'),
                JSON.stringify(products),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    static async update(prod) {
        const products = await Product.getAll()

        const idx = products.findIndex(c => c.id === prod.id)
        products[idx] = prod

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'products.json'),
                JSON.stringify(products),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }


    toJSON()
    {
        return {
            title:  this.title,
            price:  this.price,
            img:    this.img,
            id:     this.id
        }
    }
}

module.exports = Product