# Read me documentation

# DB setup
Access Mongo client and run the command:
```
db.posts.ensureIndex({ title: "text", description : "text" });
```