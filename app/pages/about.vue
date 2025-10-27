<!-- ~/pages/about.vue -->
<template>
  <div class="container mx-auto p-6 max-w-3xl flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-800 text-center">
      About CSV Processor
    </h1>

    <p class="text-gray-700">
      Welcome to the CSV Processor, your go-to tool for handling CSV files with
      ease! Built for our team, this app makes data processing a breeze. Whether
      you're tweaking headers or cleaning up columns, we've got you covered.
    </p>

    <Item variant="outline" as-child>
      <div>
        <ItemMedia>
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Easy CSV Management</ItemTitle>
          <ItemDescription>
            Upload CSV files via drag-and-drop or file selection, edit headers,
            delete columns, and download clean, quoted CSVs.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="link" size="sm" as-child>
            <NuxtLink to="/">Try it now</NuxtLink>
          </Button>
        </ItemActions>
      </div>
    </Item>

    <Item variant="outline" as-child>
      <div>
        <ItemMedia>
          <Users />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Built for Our Team</ItemTitle>
          <ItemDescription>
            Designed with love for internal use, powered by Nuxt 4, shadcn-nuxt,
            and Tailwind CSS. Have feedback? Let us know!
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="link" size="sm" as-child>
            <NuxtLink to="/contact">Share feedback</NuxtLink>
          </Button>
        </ItemActions>
      </div>
    </Item>
  </div>
</template>

<script setup lang="ts">
import { FileText, Users } from "lucide-vue-next";
</script>
