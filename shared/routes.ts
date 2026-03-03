import { z } from 'zod';
import { 
  insertUserSchema, users, 
  insertStoreSchema, stores, 
  insertProductSchema, products, 
  insertOrderSchema, orders,
  insertDeliveryTrackingSchema, deliveryTracking,
  loginSchema
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: loginSchema,
      responses: {
        200: z.object({ user: z.custom<typeof users.$inferSelect>() }),
        401: errorSchemas.unauthorized
      }
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.object({ user: z.custom<typeof users.$inferSelect>() }),
        400: errorSchemas.validation
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() })
      }
    }
  },
  stores: {
    list: {
      method: 'GET' as const,
      path: '/api/stores' as const,
      responses: {
        200: z.array(z.custom<typeof stores.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/stores/:id' as const,
      responses: {
        200: z.custom<typeof stores.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/stores' as const,
      input: insertStoreSchema,
      responses: {
        201: z.custom<typeof stores.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/stores/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof stores.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound
      }
    }
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      input: z.object({ storeId: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id' as const,
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/products' as const,
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },
  orders: {
    list: {
      method: 'GET' as const,
      path: '/api/orders' as const,
      input: z.object({ role: z.string().optional(), userId: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id' as const,
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: insertOrderSchema,
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/status' as const,
      input: z.object({ status: z.string(), driverId: z.number().optional() }),
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound
      }
    }
  },
  delivery: {
    updateLocation: {
      method: 'POST' as const,
      path: '/api/delivery/location' as const,
      input: insertDeliveryTrackingSchema,
      responses: {
        200: z.custom<typeof deliveryTracking.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    getLocation: {
      method: 'GET' as const,
      path: '/api/delivery/location/:orderId' as const,
      responses: {
        200: z.custom<typeof deliveryTracking.$inferSelect>(),
        404: errorSchemas.notFound
      }
    }
  },
  analytics: {
    getStoreStats: {
      method: 'GET' as const,
      path: '/api/analytics/store/:id' as const,
      responses: {
        200: z.object({ totalOrders: z.number(), totalRevenue: z.number() }),
        404: errorSchemas.notFound
      }
    },
    getPlatformStats: {
      method: 'GET' as const,
      path: '/api/analytics/platform' as const,
      responses: {
        200: z.object({ totalStores: z.number(), pendingStores: z.number(), totalOrders: z.number(), totalRevenue: z.number() })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}