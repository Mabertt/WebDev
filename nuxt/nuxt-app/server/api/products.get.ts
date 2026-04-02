interface ProductsResponse {
  products: any[]
}

export default defineEventHandler(async (event) => {
  try {
    const data = await $fetch<ProductsResponse>('https://dummyjson.com/products')
    return data.products
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})
