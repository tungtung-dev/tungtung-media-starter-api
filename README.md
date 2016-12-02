# Read me documentation

# DB setup
Access Mongo client and run the command:
```
db.posts.ensureIndex({ searchField: "text" });

db.tags.ensureIndex({ searchField: "text" });
```