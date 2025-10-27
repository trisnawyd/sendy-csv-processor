<template>
  <div class="flex flex-col w-full min-h-screen">
    <header-navigation />
    <main class="grow container mx-auto">
      <slot></slot>
    </main>
    <div class="flex flex-col w-full p-8 items-center justify-center border">
      Created with vibe coding at Travlr Office &#10084;
    </div>
  </div>
</template>
