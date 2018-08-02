<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">tagdynamics</router-link> |
      <a href="https://github.com/tagdynamics-org/frontend/wiki/About-tagdynamics.org">about</a> | 
      <a href="https://github.com/tagdynamics-org">github</a>
    </div>

    <router-view/>

    <footer class="footer">
        <div class="container">
            <div class="content">
                Matias Dahl 2018 &#8212;
                <a href="http://matiasdahl.iki.fi">homepage</a> &#8212;
                <a href="mailto://matias.dahl@iki.fi">email</a>
            </div>
        </div>
    </footer>
  </div>
</template>

<style scoped>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  font-size: 18px;
  padding: 20px;
}

#nav a {
  font-weight: bold;
  color: #263238;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #7986CB;
  text-decoration: none;
}

a {
  color: #7986CB;
}

</style>
