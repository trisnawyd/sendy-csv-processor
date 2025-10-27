<!-- ~/components/CsvProcessor.vue -->
<template>
  <div v-if="csvData.length" class="mt-6 text-left">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">CSV Data</h3>
      <Button v-if="csvData.length" @click="downloadCsv">Download CSV</Button>
    </div>
    <div class="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              v-for="(header, index) in headers"
              :key="index"
              class="font-bold text-black"
            >
              <div class="flex items-center gap-2 py-4">
                <Input
                  v-model="headers[index]"
                  placeholder="Header Name"
                  @input="updateHeader(index, $event)"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  @click="deleteColumn(index)"
                >
                  Delete
                </Button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, rowIndex) in csvData" :key="rowIndex">
            <TableCell v-for="(cell, cellIndex) in row" :key="cellIndex">
              {{ cell }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
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
    <p class="text-gray-600 mb-4">
      Drag and drop a CSV file here or
      <Button variant="outline" @click="$refs.fileInput.click()">
        Select File
      </Button>
    </p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
// Define types
interface CsvRow extends Array<string> {}

// Reactive state
const isDragging = ref<boolean>(false);
const csvData = ref<CsvRow[]>([]);
const headers = ref<string[]>([]);
const error = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);

// Handle file drop
const handleDrop = async (event: DragEvent): Promise<void> => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    await processFile(file);
  }
};

// Handle file selection via input
const handleFileSelect = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
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
    const rows = text.split("\n").map(
      (row: string) =>
        row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")) // Remove surrounding quotes only
    );

    // Ensure headers are set, use empty string for missing headers
    headers.value = rows[0] || [];
    // Ensure rows have the same length as headers
    const headerLength = headers.value.length;
    csvData.value = rows
      .slice(1)
      .map((row: CsvRow) => {
        // Pad or truncate row to match header length
        const newRow = [...row];
        while (newRow.length < headerLength) newRow.push("");
        return newRow.slice(0, headerLength);
      })
      .filter((row: CsvRow) => row.some((cell) => cell !== "")); // Skip rows with all empty cells
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

// Download processed CSV
const downloadCsv = (): void => {
  // Use headers and rows as-is, preserving empty cells
  const cleanHeaders = headers.value;
  const cleanRows = csvData.value;

  // Skip download if no valid data
  if (!cleanHeaders.length || !cleanRows.length) {
    error.value = "No valid data to download.";
    return;
  }

  // Wrap headers in double quotes, preserve empty headers as ""
  const quotedHeaders = cleanHeaders.map((header) => `"${header}"`);

  // Preserve empty cells in rows
  const csvContent = [
    quotedHeaders.join(","),
    ...cleanRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "processed.csv";
  a.click();
  URL.revokeObjectURL(url);
};
</script>
