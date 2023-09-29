const express = require('express'); 
const router  = express.Router();
const db      = require('../database/blog');
router.get('/',(req,res)=>{
   res.redirect('/posts');
});
router.get('/posts',async (req,res)=>{
    const [posts]=await db.query('SELECT posts.*,author.name FROM posts INNER JOIN author ON author_id = author.id');
    console.log(posts);
   res.render('posts-list.ejs',{posts:posts});
});

router.get('/new-post',async (req,res)=>{
    const [authors] = await db.query('select * from author');
    res.render('create-post.ejs', { authors: authors });
 });

 router.post('/posts',async (req,res)=>{
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author
    ]
     await db.query('insert into posts (title,summary,body,author_id) values (?)',[data]);
    
    res.redirect('/posts');
 });
 // View post dynamic path
router.get('/posts/:id', async (req, res) => {
   const postId = req.params.id;
   const query = 'SELECT posts.*, author.name AS author_name, author.email AS author_email FROM posts INNER JOIN author ON posts.author_id = author.id WHERE posts.id = ?';
   const [post] = await db.query(query, [postId]);
   if (!post || post.length === 0) {
       return res.status(404).render('404'); // Post not found, render a 404 page
   }
   const postdata = {
      ...post[0],
      date:post[0].date.toISOString(),
      humanreadabledate: post[0].date.toLocaleDateString('en-US',{
         weekday: 'long',
         month:'long',
         year:'numeric',
         day:'numeric'
      })
   }
   res.render('post-detail.ejs', { post: postdata });
});

//update the posts
router.get('/posts/:id/edit',async(req,res)=>{
   const query  = `select * from posts
                   where id = ?`;
   const [post] = await db.query(query,[req.params.id]);
   

   if (!post || post.length === 0) {
      return res.status(404).render('404'); // Post not found, render a 404 page
   }
   res.render('update-post.ejs',{post:post[0]});
});
//update post getting POST req
router.post('/posts/:id/edit',async(req,res)=>{
   const query = `update posts 
   set title = ? , summary = ? ,body = ? 
   where id = ? ` ;
   db.query(query,[
      req.body.title,
      req.body.summary,
      req.body.content,
      req.params.id
   ])
   res.redirect('/posts');
});

//deleting post
router.post('/posts/:id/delete',async(req,res)=>{
   const query = `delete from posts
                  where id = ?`;
  await db.query(query,[req.params.id]);
   res.redirect('/posts');
})
module.exports = router;