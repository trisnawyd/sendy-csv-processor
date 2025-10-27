<template>
  <div class="flex flex-col w-full min-h-screen">
    <header-navigation />
    <main class="grow container mx-auto">
      <slot></slot>
    </main>
    <div class="flex flex-col w-full p-8 items-center justify-center border">
      Footer
    </div>
  </div>
</template>
