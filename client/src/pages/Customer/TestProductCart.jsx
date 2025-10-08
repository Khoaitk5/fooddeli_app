import React from 'react';
import ProductCart from '../../components/role-specific/Customer/ProductCart';

const TestProductCart = () => {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Test ProductCart Component
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            ProductCart Preview:
          </h2>

          <div className="flex justify-center">
            <ProductCart />
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Component Details:</h3>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Width: 275px</li>
              <li>• Height: 80px</li>
              <li>• Background: White</li>
              <li>• Border Radius: 8px</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProductCart;