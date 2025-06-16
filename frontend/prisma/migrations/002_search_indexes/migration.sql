-- CreateIndex
CREATE INDEX "idx_jobs_title_gin" ON "jobs" USING gin(to_tsvector('french', title));

-- CreateIndex
CREATE INDEX "idx_companies_name_gin" ON "companies" USING gin(to_tsvector('french', name)); 