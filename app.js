
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
	.get(function(req, res){
		Article.find({}, function(error, results){
			if(!error){
				res.send(results);
			} else {
				res.send("Unauthorized Post")
			}
		});
	})
	.post(function(req, res){
		const title = req.body.title;
		const content = req.body.content;
	
		const newArticle = new Article({
			title: title,
			content: content
		});
		newArticle.save(function(error){
			if(!error){
				res.send("Successfully Added New Article");
			} else {
				res.send(error);
			}
		});
	})
	.delete(function(req, res){
		Article.deleteMany({}, function(error){
			if(!error){
				res.send("Successfully Deleted All Articles");
			} else {
				res.send(error);
			}
		});
	});

app.route("/articles/:title")
	.get(function(req, res){
		const title = req.params.title;
		Article.findOne({title: title}, function(error, result){
			if(!error){
				res.send(result);
			} else {
				res.send(error);
			}
		});
	})
	.put(function(req, res){
		const title = req.params.title;
		Article.update(
			{
				title: title
			},
			{
				title: req.body.title,
				content: req.body.content
			},
			{
				overrite: true
			},
			function(error){
				if(!error){
					res.send("Success !!");
				}
			}
		);
	})
	.patch(function(req, res){
		const title = req.params.title;
		Article.update(
			{
				title: title
			},
			{$set: req.body},
			function(error){
				if(!error){
					res.send("Successfully Updated");
				} else {
					res.send(error);
				}
			}
		);
	})
	.delete(function(req, res){
		const title = req.params.title;
		Article.deleteOne(
			{
				title: title
			},
			function(error){
				if(!error){
					res.send("Successfully Deleted");
				} else {
					res.send(error);
				}
			}
		);
	});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
