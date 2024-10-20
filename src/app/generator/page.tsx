'use client';

import React from 'react';
import DomainGeneratorForm from '../../components/DomainGeneratorForm';

export default function GeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Domain Pattern Generator</h1>
      <DomainGeneratorForm />
    </div>
  );
}
