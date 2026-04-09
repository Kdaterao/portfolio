<script>
  let password = '';

  function login() {
    // store password in localStorage or cookie
    localStorage.setItem('portal-key', password);
    // reload page to apply
    window.location.reload();
  }
  
</script>

<input type="password" bind:value={password} placeholder="Enter password" />
<button on:click={login}>Login</button>