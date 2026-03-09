const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Shop CO Backend API",
    version: "1.0.0",
    description: "API documentation for Shop CO backend",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          _id: { type: "string", example: "65f1b2c3d4e5f6a7b8c9d0e1" },
          title: { type: "string", example: "Classic Hoodie" },
          description: { type: "string", example: "Warm and comfy hoodie" },
          price: { type: "number", example: 49.99 },
          type: { type: "string", example: "hoodie" },
          category: { type: "string", example: "men" },
          colors: { type: "array", items: { type: "string" }, example: ["black", "gray"] },
          size: { type: "array", items: { type: "string" }, example: ["S", "M", "L"] },
          images: {
            type: "array",
            items: { type: "string" },
            example: ["https://res.cloudinary.com/demo/image/upload/v1/hoodie.jpg"],
          },
          comments: {
            type: "array",
            items: { $ref: "#/components/schemas/ProductComment" },
          },
        },
      },
      ProductComment: {
        type: "object",
        properties: {
          user: { type: "string", example: "Ali Valiyev" },
          userRate: { type: "number", example: 5 },
          posted: { type: "string", example: "2026-03-10T10:30:00.000Z" },
          comment: { type: "string", example: "Juda zo'r mahsulot" },
        },
      },
      Type: {
        type: "object",
        properties: {
          _id: { type: "string", example: "65f1b2c3d4e5f6a7b8c9d0e2" },
          name: { type: "string", example: "hoodie" },
        },
      },
      UserPublic: {
        type: "object",
        properties: {
          id: { type: "string", example: "65f1b2c3d4e5f6a7b8c9d0e3" },
          firstName: { type: "string", example: "Ali" },
          lastName: { type: "string", example: "Valiyev" },
          email: { type: "string", example: "ali@example.com" },
          role: { type: "string", example: "user" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          firstName: { type: "string", example: "Ali" },
          lastName: { type: "string", example: "Valiyev" },
          email: { type: "string", example: "ali@example.com" },
          password: { type: "string", example: "StrongPass123" },
          role: { type: "string", example: "user" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "ali@example.com" },
          password: { type: "string", example: "StrongPass123" },
        },
      },
      CreateProductRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Classic Hoodie" },
          description: { type: "string", example: "Warm and comfy hoodie" },
          price: { type: "number", example: 49.99 },
          type: { type: "string", example: "hoodie" },
          category: { type: "string", example: "men" },
          colors: { type: "array", items: { type: "string" }, example: ["black", "gray"] },
          size: { type: "array", items: { type: "string" }, example: ["S", "M", "L"] },
          images: {
            type: "array",
            items: { type: "string" },
            example: ["https://res.cloudinary.com/demo/image/upload/v1/hoodie.jpg"],
          },
        },
      },
      UpdateProductRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Classic Hoodie v2" },
          price: { type: "number", example: 59.99 },
          colors: { type: "array", items: { type: "string" }, example: ["black", "blue"] },
        },
      },
      CreateTypeRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "jacket" },
        },
      },
      AddCommentRequest: {
        type: "object",
        required: ["userRate", "comment"],
        properties: {
          userRate: { type: "number", example: 4 },
          comment: { type: "string", example: "Sifatli, lekin rangi biroz boshqacha" },
        },
      },
    },
  },
  tags: [
    { name: "Auth" },
    { name: "Products" },
    { name: "Types" },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
              example: {
                firstName: "Ali",
                lastName: "Valiyev",
                email: "ali@example.com",
                password: "StrongPass123",
                role: "user",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Registered",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/UserPublic" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
              example: {
                email: "ali@example.com",
                password: "StrongPass123",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/UserPublic" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Current user",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UserPublic" } },
            },
          },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products with filters",
        parameters: [
          {
            name: "type",
            in: "query",
            schema: { type: "string" },
            example: "hoodie,jacket",
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
            example: "men,women",
          },
          {
            name: "minPrice",
            in: "query",
            schema: { type: "number" },
            example: 10,
          },
          {
            name: "maxPrice",
            in: "query",
            schema: { type: "number" },
            example: 200,
          },
          {
            name: "colors",
            in: "query",
            schema: { type: "string" },
            example: "black,white",
          },
          {
            name: "size",
            in: "query",
            schema: { type: "string" },
            example: "S,M,L",
          },
        ],
        responses: {
          200: {
            description: "List of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create product (admin only)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProductRequest" },
              example: {
                title: "Classic Hoodie",
                description: "Warm and comfy hoodie",
                price: 49.99,
                type: "hoodie",
                category: "men",
                colors: ["black", "gray"],
                size: ["S", "M", "L"],
                images: [
                  "https://res.cloudinary.com/demo/image/upload/v1/hoodie.jpg",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Product" } },
            },
          },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Product",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Product" } },
            },
          },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update product (admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProductRequest" },
              example: {
                title: "Classic Hoodie v2",
                price: 59.99,
                colors: ["black", "blue"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Updated",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Product" } },
            },
          },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product (admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Deleted",
          },
        },
      },
    },
    "/api/products/{id}/comments": {
      post: {
        tags: ["Products"],
        summary: "Add comment to product",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddCommentRequest" },
              example: {
                userRate: 5,
                comment: "Juda zo'r mahsulot",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Comment added",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Product" } },
            },
          },
        },
      },
    },
    "/api/products/upload": {
      post: {
        tags: ["Products"],
        summary: "Upload single image (admin only)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary" },
                },
                required: ["image"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Uploaded",
          },
        },
      },
    },
    "/api/products/with-images": {
      post: {
        tags: ["Products"],
        summary: "Create product with images (admin only)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                  title: { type: "string", example: "Classic Hoodie" },
                  description: { type: "string", example: "Warm and comfy hoodie" },
                  price: { type: "number", example: 49.99 },
                  type: { type: "string", example: "hoodie" },
                  category: { type: "string", example: "men" },
                  colors: { type: "string", example: "black,gray" },
                  size: { type: "string", example: "S,M,L" },
                },
                required: ["images", "title", "price"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Product" } },
            },
          },
        },
      },
    },
    "/api/types": {
      get: {
        tags: ["Types"],
        summary: "Get all types",
        responses: {
          200: {
            description: "List of types",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Type" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Types"],
        summary: "Create type (admin only)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTypeRequest" },
              example: { name: "jacket" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Type" } },
            },
          },
        },
      },
    },
    "/api/types/{id}": {
      delete: {
        tags: ["Types"],
        summary: "Delete type (admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Deleted",
          },
        },
      },
    },
  },
};

export default swaggerSpec;
