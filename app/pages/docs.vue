<template>
  <div class="container mx-auto p-6">
    <div class="flex flex-col gap-4 mb-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">
        CSV Processor - Sendy Documentation
      </h1>
      <p class="text-gray-700 max-w-2xl mx-auto">
        Access our team’s Sendy documentation for the CSV Processor. Find
        guides, tips, and collaboration details in the Google Doc to make the
        most of your CSV workflows!
      </p>
    </div>
    <Item variant="outline" as-child>
      <a
        href="https://docs.google.com/document/d/1-ZaQZw74WdvvXEVEDvKturkyp2d6Ya7RQWUYfIaO0LY/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ItemMedia>
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sendy Documentation</ItemTitle>
          <ItemDescription>
            Guides and collaboration details for the CSV Processor in Google
            Docs.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="link" size="sm">Open</Button>
        </ItemActions>
      </a>
    </Item>
  </div>
</template>
