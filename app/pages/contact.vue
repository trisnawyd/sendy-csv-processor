<!-- ~/pages/contact.vue -->
<template>
  <div class="container mx-auto p-6 max-w-3xl flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-800 text-center">
      Hey Team, Let's Connect!
    </h1>

    <p class="text-gray-700">
      Got a question about the CSV Processor or want to share feedback? We're
      all in this together, so feel free to ping us on Slack!
    </p>

    <Item variant="outline" as-child>
      <a href="https://travlrptyltd.slack.com/team/U07FCNBUR8D" target="_blank">
        <ItemMedia>
          <Slack />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Contact on Slack</ItemTitle>
          <ItemDescription>
            Reach out for help, ideas, or just to chat.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="link" size="sm"> Open </Button>
        </ItemActions>
      </a>
    </Item>
    <Item variant="outline" as-child>
      <a href="https://wa.me/6281237754778" target="_blank">
        <ItemMedia>
          <MessageCircleCodeIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Contact on Whatsapp</ItemTitle>
          <ItemDescription>
            Reach out for help, ideas, or just to chat.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="link" size="sm"> Open </Button>
        </ItemActions>
      </a>
    </Item>
  </div>
</template>

<script setup lang="ts">
import {
  Slack,
  MessageCircleCode,
  MessageCircleCodeIcon,
} from "lucide-vue-next";
</script>
