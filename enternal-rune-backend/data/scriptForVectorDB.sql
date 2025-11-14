-- Enable pgvector extension (run once per database)
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store embeddings generated from product data.
-- Adjust dimension (1536) to match embedding model you plan to use.
CREATE TABLE IF NOT EXISTS product_embeddings (
    prod_id      INT PRIMARY KEY REFERENCES products(prod_id) ON DELETE CASCADE,
    source_text  TEXT NOT NULL,
    embedding    vector(1536) NOT NULL,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: store embeddings for other knowledge sources (e.g., brand info)
CREATE TABLE IF NOT EXISTS brand_embeddings (
    brand_id     INT PRIMARY KEY REFERENCES brands(brand_id) ON DELETE CASCADE,
    source_text  TEXT NOT NULL,
    embedding    vector(1536) NOT NULL,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Speed up similarity search with IVF index (tune lists per dataset size).
CREATE INDEX IF NOT EXISTS idx_product_embeddings_vector
    ON product_embeddings
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_brand_embeddings_vector
    ON brand_embeddings
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 50);

-- Helper view to join embeddings back to product metadata if needed.
CREATE OR REPLACE VIEW product_embedding_view AS
SELECT p.prod_id,
       p.product_name,
       p.product_description,
       pe.embedding
FROM products p
         JOIN product_embeddings pe ON p.prod_id = pe.prod_id;

/*
Usage notes:
1. Generate embedding vectors (dimension must match vector(1536)) for your texts via the embedding API
   (OpenAI text-embedding-3-large, Gemini embeddings, etc.).
2. Insert/update using prepared statements, e.g.:
      INSERT INTO product_embeddings (prod_id, source_text, embedding)
      VALUES (?, ?, ?::vector)
      ON CONFLICT (prod_id) DO UPDATE
          SET source_text = EXCLUDED.source_text,
              embedding = EXCLUDED.embedding,
              updated_at = CURRENT_TIMESTAMP;
3. Retrieve top-k similar products for a user query embedding:
      SELECT p.*
      FROM product_embedding_view p
      ORDER BY p.embedding <=> '[0.12, 0.98, ...]'::vector
      LIMIT 5;
*/
SELECT COUNT(*) FROM product_embeddings;