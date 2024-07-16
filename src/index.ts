import express, { Request, Response } from 'express';
import { createClient } from '@vercel/postgres'

const client = createClient({
    connectionString: "postgres://default:nTzaMxj9vg6L@ep-raspy-dust-a4uxw93b.us-east-1.aws.neon.tech:5432/verceldb"
})

const app = express(); 
const port = process.env.PORT || 3000; 
const server = express.json();

app.use(server);

client.connect();

app.get("/posts", async (req: Request, res: Response) => { // Read all
    const posts = await client.query('SELECT * FROM posts');
    res.status(200).json(posts.rows);
});

app.get("/posts/:idPost", (req: Request, res: Response) => { // Read idPost
    client.query(`SELECT * FROM posts WHERE id = $1`, [req.params.idPost], function(err, result){
        if (err) return res.status(400).json({message: "Error"});
        else return res.status(200).json(result.rows);
    })
})

app.post("/posts", (req: Request, res: Response) => { // Create
    client.query(`INSERT INTO posts (title, content) VALUES ($1, $2)`, [req.body.title, req.body.content], function(err){
        if (err) return res.status(400).json({message: "Error"});
        else return res.status(200).json({message: "Success"});
    });
});

app.put("/posts/:idPost", async (req: Request, res: Response) => { // Update
    client.query(`UPDATE posts SET title = $1, content = $2 WHERE id = $3`, [req.body.title, req.body.content, req.params.idPost], function(err){
        if (err) return res.status(400).json({message: "Error"});
        else return res.status(200).json({message: "Success"});
    });
});

app.delete("/posts/:idPost", (req: Request, res: Response) => { // Delete
    client.query(`DELETE FROM posts WHERE id = $1`, [req.params.idPost], function(err){
        if (err) return res.status(400).json({message: "Error"});
        else return res.status(200).json({message: "Success"});
    });
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});