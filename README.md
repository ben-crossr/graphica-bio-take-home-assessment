# 🧬 Ben Vozza Take Home Assessment

This repository contains a full-stack application that allows users to search for and explore proteins, their associated identifiers, functional annotations, and protein-protein interactions. 

The project is Ben Vozza's submission for the take home test for **Biographica**.

## 🚀 Features

- **Protein Search**  
  Search by accession, or UUID.

- **Protein Detail View**  
  - Functional annotations  
  - Associated protein identifiers  
  - Protein-protein interaction partners  
  - Protein sequence (if available)

- **Modular Frontend Architecture**  
  Built with React + TypeScript using atomic design principles (atoms, molecules, organisms).

- **Scalable Backend**  
  FastAPI backend with an abstracted `Database` interface and a Parquet-based implementation for easy future extendability (e.g. Postgres implementation).


## 🐳 How to Run

> ⚠️ **Docker Desktop must be running** on your machine before starting.

1. **Prepare the data**  
  Create a `data/` folder in the base of this repo containing the necessary `.parquet` files (named exactly as below):
  - `protein_nodes.parquet`
  - `go_term_nodes.parquet`
  - `edges.parquet`
  - `protein_id_records.parquet`

2. **Start the application**  
   Run the following command from the root of the project:

   ```bash
   docker-compose up --build
   ```

This will:
- Build and start the FastAPI backend (http://localhost:8000)
- Build the frontend and serve it via Nginx (http://localhost:3000)
- Mount the data/ directory into the backend container

> ⚠️ **Wait until the backend API is ready before interacting with the application**.


##  Known Limitations & Future Work
- Sorting Ascending/Descending by column scores.
- No persistent database — the Parquet files are loaded ("indexed") into memory at start time (why the backend API takes a little time to be ready).
- Increased number of search term's for a given protein.
- No authentication / user management.
- No test suite or CI/CD pipeline in either project.
- Add more detailed documentation, README in each project's directory. 
- Split out into two git repo's instead of one.

