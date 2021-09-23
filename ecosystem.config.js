module.exports = {
  apps : [{
    name        : "name",
    script      : "./bin/www",
    watch       : true,
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "name",
    script     : "./bin/www",
    instances  : "max",
    exec_mode  : "cluster"
  }]
}
