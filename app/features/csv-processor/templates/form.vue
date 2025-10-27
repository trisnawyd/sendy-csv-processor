<!-- ~/components/CsvProcessor.vue -->
<template>
  <div v-if="csvData.length" class="mt-6 text-left">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">CSV Data</h3>
      <Button @click="openDownloadDialog"> Download CSV </Button>
    </div>
    <ScrollArea class="w-full h-[400px] border border-gray-300 rounded-md">
      <Table>
        <TableHeader class="sticky top-0 z-10 bg-white">
          <TableRow>
            <TableHead
              v-for="(header, index) in headers"
              :key="index"
              class="font-bold text-gray-900"
            >
              <div class="flex flex-col w-full gap-1.5 py-4 px-2">
                <Label :for="`header-${index}`">Header Name</Label>
                <div class="flex items-center gap-2">
                  <Input
                    v-model="headers[index]"
                    :id="`header-${index}`"
                    placeholder="Header Name"
                    @input="updateHeader(index, $event)"
                    class="border-gray-300"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Button
                          variant="destructive"
                          size="sm"
                          @click="deleteColumn(index)"
                        >
                          <Trash2Icon class="w-4 h-4" />
                          Delete
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>this button will remove column from the csv file</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, rowIndex) in csvData" :key="rowIndex">
            <TableCell
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              class="text-gray-700"
            >
              {{ cell }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollArea>

    <div class="flex flex-col py-4">
      <p class="text-sm text-gray-500">
        <span class="font-bold text-gray-900">Note* </span>
        please delete any unwanted columns by clicking the "Delete" button above
        each column header.
      </p>
    </div>

    <!-- Download Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-md bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle class="text-gray-900">Download CSV</DialogTitle>
          <DialogDescription class="text-gray-600">
            Enter a file name for your CSV download (e.g., my-data.csv).
          </DialogDescription>
        </DialogHeader>
        <div class="flex items-center space-x-2">
          <Input
            v-model="downloadFileName"
            placeholder="Enter file name"
            class="border-gray-300"
            @keyup.enter="confirmDownload"
          />
        </div>
        <DialogFooter class="sm:justify-end">
          <Button
            variant="outline"
            @click="isDialogOpen = false"
            class="text-gray-700 border-gray-300"
          >
            Cancel
          </Button>
          <Button @click="confirmDownload"> Download </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
  <div
    v-else
    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
    :class="{ 'border-blue-500 bg-blue-50': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <input
      type="file"
      accept=".csv"
      class="hidden"
      ref="fileInput"
      @change="handleFileSelect"
    />
    <p class="text-gray-600 mb-4 flex flex-col items-center gap-4">
      Drag and drop a CSV file here or
      <Button
        variant="outline"
        class="w-fit border-gray-300 text-gray-700 hover:bg-gray-100"
        @click="$refs.fileInput.click()"
      >
        Select File
      </Button>
    </p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { Trash2Icon } from "lucide-vue-next";

// Define types
interface CsvRow extends Array<string> {}

// Reactive state
const isDragging = ref<boolean>(false);
const csvData = ref<CsvRow[]>([]);
const headers = ref<string[]>([]);
const error = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);
const isDialogOpen = ref<boolean>(false);
const downloadFileName = ref<string>("processed.csv");
const uploadedFileName = ref<string>(""); // Store uploaded file name

// Open the download dialog
const openDownloadDialog = (): void => {
  isDialogOpen.value = true;
  downloadFileName.value = uploadedFileName.value || "processed.csv"; // Use uploaded file name or default
};

// Handle file drop
const handleDrop = async (event: DragEvent): Promise<void> => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    uploadedFileName.value = file.name; // Store uploaded file name
    await processFile(file);
  }
};

// Handle file selection via input
const handleFileSelect = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploadedFileName.value = file.name; // Store uploaded file name
    await processFile(file);
  }
};

// Process the CSV file
const processFile = async (file: File): Promise<void> => {
  if (!file || !file.name.endsWith(".csv")) {
    error.value = "Please upload a valid CSV file.";
    return;
  }

  error.value = "";
  try {
    const text = await file.text();
    const rows = text
      .split("\n")
      .map((row: string) =>
        row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
      );

    headers.value = rows[0] || [];
    const headerLength = headers.value.length;
    csvData.value = rows
      .slice(1)
      .map((row: CsvRow) => {
        const newRow = [...row];
        while (newRow.length < headerLength) newRow.push("");
        return newRow.slice(0, headerLength);
      })
      .filter((row: CsvRow) => row.some((cell) => cell !== ""));
  } catch (err) {
    error.value = "Error parsing CSV file.";
  }
};

// Update header value
const updateHeader = (index: number, event: Event): void => {
  const input = event.target as HTMLInputElement;
  headers.value[index] = input.value;
};

// Delete a column by index
const deleteColumn = (index: number): void => {
  headers.value.splice(index, 1);
  csvData.value = csvData.value.map((row) => {
    const newRow = [...row];
    newRow.splice(index, 1);
    return newRow;
  });
  if (!headers.value.length) {
    csvData.value = [];
    error.value = "All columns deleted. Please upload a new CSV file.";
  }
};

// Confirm download with custom file name
const confirmDownload = (): void => {
  if (!headers.value.length || !csvData.value.length) {
    error.value = "No valid data to download.";
    isDialogOpen.value = false;
    return;
  }

  const cleanHeaders = headers.value;
  const cleanRows = csvData.value;

  const quotedHeaders = cleanHeaders.map((header) => `"${header}"`);
  const csvContent = [
    quotedHeaders.join(","),
    ...cleanRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  let fileName = downloadFileName.value.trim();
  if (!fileName) fileName = uploadedFileName.value || "processed.csv"; // Fallback to uploaded file name
  if (!fileName.toLowerCase().endsWith(".csv")) fileName += ".csv";
  a.download = fileName;

  a.click();
  URL.revokeObjectURL(url);
  isDialogOpen.value = false;
};
</script>
