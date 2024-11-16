"use client"
import { useState } from 'react';
import Papa from 'papaparse';
import { Input } from '@nextui-org/react';
// import { uploadWL } from '@/api/api';

// components/Upload.tsx
const Upload = () => {

  const [csvData, setCsvData] = useState<any[]>([]);
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [price, setPrice] = useState("")
  const [limit, setLimit] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        header: true, // Convert CSV to JSON with headers
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
        },
      });
    }
  };

  const handleSubmit = async () => {
    // const response = await uploadWL(csvData, name, type, price, limit)
    // console.log("response", response)
  };

  return (
    <section className="flex flex-col w-1/2 mx-auto bg-white rounded-lg bg-opacity-50 p-12">
      <h1>Upload CSV File</h1>
      <div className='flex flex-col gap-2'>
        <Input
          value={limit}
          type="number"
          label="Mint Limit"
          placeholder="Limit"
          className=""
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small"></span>
            </div>
          }
          onValueChange={setLimit}
        />
        <Input
          value={type}
          onValueChange={setType}
          type="text"
          label="Type"
          placeholder="Type"
          className=""
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small"></span>
            </div>
          }
        />
        <Input
          value={price}
          onValueChange={setPrice}
          type="number"
          label="Price"
          placeholder=""
          className=""
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">SUI</span>
            </div>
          }
        />
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <button onClick={handleSubmit} className='bg-primary hover:bg-pink-600 rounded-lg active:scale-95 duration-100 text-white py-3'>Submit</button>
      </div>
    </section>
  );
};

export default Upload;
