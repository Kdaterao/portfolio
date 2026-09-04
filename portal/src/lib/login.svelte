<script lang="ts">
  import { API_SERVER } from "./variables";

  let username = '';
  let password = '';
  let error = '';
  let loading = false;

  async function login() {
    error = '';
    loading = true;

    try {
      const res = await fetch(`${API_SERVER}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        error = 'Invalid username or password';
        return;
      }

      localStorage.setItem('portal-auth', '1');
      window.location.reload();
    } catch {
      error = 'Could not reach the server';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') login();
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6">
  <div class="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Admin Portal</h1>
    <p class="text-center text-gray-400 mb-8">Sign in to continue</p>

    <div class="space-y-4">
      <input
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        bind:value={username}
        placeholder="Username"
        autocomplete="username"
        on:keydown={handleKeydown}
      />
      <input
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        bind:value={password}
        placeholder="Password"
        autocomplete="current-password"
        on:keydown={handleKeydown}
      />

      {#if error}
        <p class="text-red-400 text-sm">{error}</p>
      {/if}

      <button
        class="w-full px-4 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-500 transition-all duration-200 disabled:opacity-50"
        on:click={login}
        disabled={loading || !username || !password}
      >
        {loading ? 'Signing in...' : 'Login'}
      </button>
    </div>
  </div>
</div>
