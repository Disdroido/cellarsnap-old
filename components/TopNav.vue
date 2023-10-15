<script setup>
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const profileDropdown = ref(false);

  console.log(user.name);

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut(); 
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      toast.add({
        id: 'addBottleToDBError',
        title: 'ERROR',
        description: error.message,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  }

  // Add event listener to close dropdown when clicking outside
  onMounted(() => {
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.dropdown')) {
        profileDropdown.value = false;
      }
    });
  });
</script>

<template>
  <header>
    <nav
      class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 md:ml-72">
      <div class="flex flex-wrap justify-between items-center mx-auto">
        <NuxtLink to="/" class="flex items-center md:hidden">
          <img
            src="../assets/images/cellarsnap-logo.png"
            class="mr-3 h-6 sm:h-8"
            alt="CellarSnap Logo" />
        </NuxtLink>
        <div class="flex items-center lg:order-last place-items-end ml-auto">
          <button
            type="button"
            @click="profileDropdown = true"
            class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 dropdown"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="dropdown">
            <span class="sr-only">Open user menu</span>
            <img
              class="w-8 h-8 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="user photo" />
          </button>
          <!-- Dropdown menu -->
          <div v-show="profileDropdown"
            class="origin-top-right absolute right-0 top-16 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dropdown">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Account settings</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My likes</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Collections</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Pro version</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
            </div>
          </div>
          
          <NuxtLink
            to="#" @click="logout()"
            class="text-cellarsnap-primary dark:text-primary-500 ml-1 lg:ml-3 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >Log out</NuxtLink>
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-2"
            aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"></path>
            </svg>
            <svg
              class="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

