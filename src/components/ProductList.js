const ProductList = ({ products }) => {
  const renderTable = () => {
    const rows = [...Array(Math.ceil(products.length / 5))];
    const productRows = rows.map((row, idx) => products.slice(idx * 5, idx * 5 + 5));

    return (
      <div className="grid grid-cols-5 gap-4">
        {products.map((product, idx) => (
          <div className="flex flex-col justify-between bg-blue-50 rounded p-2 h-full" key={idx}>
            <div>
              <div className="text-md leading-tight">{product.product}</div>
              <div className="text-xs">{product.brand || ''}</div>
              <div className="text-xs whitespace-nowrap overflow-hidden overflow-ellipsis"
                title={product.id}>ID: {product.id}
                </div>
            </div>
            <p className="text-md self-start">{product.price} ₽</p>
          </div>
        ))}
      </div>

    );
  };

  return renderTable();
};

export default ProductList