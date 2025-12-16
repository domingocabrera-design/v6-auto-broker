import fs from "fs";
import csv from "csv-parser";

const results = [];

fs.createReadStream("copart.csv")   // <-- place your CSV in project ROOT
  .pipe(csv())
  .on("data", (row) => {
    try {
      const mapped = {
        lotId: row["Unnamed: 8"],
        year: row["Unnamed: 9"],
        make: row["Unnamed: 10"],
        model: row["Unnamed: 11"],
        odometer: row["Unnamed: 18"],
        location: row["Unnamed: 2"],
        primaryDamage: row["Unnamed: 21"],
        secondaryDamage: row["Unnamed: 22"],
        image:
          row["Unnamed: 32"] ||
          row["Unnamed: 31"] ||
          null,
      };

      if (mapped.lotId) {
        results.push(mapped);
      }
    } catch (err) {
      console.error("Error mapping row:", err);
    }
  })
  .on("end", () => {
    fs.writeFileSync("copart-clean.json", JSON.stringify(results, null, 2));
    console.log("🎉 Clean dataset saved to copart-clean.json");
    console.log("Total lots imported:", results.length);
  });
