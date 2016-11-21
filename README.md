# Read me documentation

# DB setup
Access Mongo client and run the command:
```
db.blogs.ensureIndex({ title: "text", description : "text" });
```