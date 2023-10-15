<script setup>
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useSupabaseUser();

  const topNavOpen = ref(false)

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut(); 
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.log(error.message);
    }
  }
</script>

<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-5 dark:bg-gray-800">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <a href="https://flowbite.com" class="flex items-center">
          <img src="../assets/images/cellarsnap-logo-light.png" class="mr-3 h-6 sm:h-8" alt="CellarSnap Logo" />
        </a>
        <div class="md:flex items-center lg:order-2 uppercase">
          <div class="hidden md:block">
            <div v-if="!user">
              <NuxtLink to="/login"
                class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log
                in</NuxtLink>
              <NuxtLink to="/register"
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Get
                started</NuxtLink>
            </div>
            <div v-else>
              <NuxtLink @click="logout()"
                class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">logout
              </NuxtLink>
            </div>
          </div>

          <button class="md:hidden" @click="topNavOpen = true">open</button>
        </div>
        <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 uppercase" id="mobile-menu-2">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <NuxtLink to="/"
                class="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                aria-current="page">Home</NuxtLink>
            </li>
            <li v-if="user">
              <NuxtLink to="/mycellars"
                class="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                aria-current="page">My Cellars</NuxtLink>
            </li>
          </ul>
        </div>

        <USlideover :overlay="false" v-model="topNavOpen" :ui="{ overlay: { baackground: 'bg-[#333333]' } }">
          <button @click="topNavOpen = false" class="mt-5 mr-5 ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <ul class="flex flex-col mt-4 gap-4 px-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 uppercase">
            <li>
              <NuxtLink to="/"
                class="block py-2 pr-4 pl-3 text-white"
                aria-current="page">Home</NuxtLink>
            </li>
            <li v-if="user">
              <NuxtLink to="/mycellars"
                class="block py-2 pr-4 pl-3 text-white"
                aria-current="page">My Cellars</NuxtLink>
            </li>

            <div v-if="!user">
              <NuxtLink to="/login"
                class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log
                in</NuxtLink>
              <NuxtLink to="/register"
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Get
                started</NuxtLink>
            </div>
            <div v-else>
              <NuxtLink @click="logout()"
                class="block py-2 pr-4 pl-3 text-white">logout
              </NuxtLink>
            </div>
          </ul>
        </USlideover>
      </div>
    </nav>
  </header>
</template>