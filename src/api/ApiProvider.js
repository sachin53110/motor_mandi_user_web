
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://scaredrealm.com/speedy_fix_node_backend/api/v1/";

// ── Generic request helper ────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
  };

  const config = {
    method: options.method || "GET",
    headers: { ...defaultHeaders, ...options.headers },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || "Network error", 0, null);
  }
}

// ── Custom Error Class ────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

// ── Tyre API Module ───────────────────────────────────────────────────────────
const tyreApi = {
  /**
   * GET /tyre/list
   * @param {object} params - { page, limit, condition, type, minPrice, maxPrice }
   */
  getList: (params = {}) => {
    const query = new URLSearchParams();
    if (params.page)      query.set("page",      params.page);
    if (params.limit)     query.set("limit",     params.limit);
    if (params.condition) query.set("condition", params.condition);
    if (params.type)      query.set("type",      params.type);
    if (params.minPrice)  query.set("minPrice",  params.minPrice);
    if (params.maxPrice)  query.set("maxPrice",  params.maxPrice);

    const qs = query.toString();
    return request(`tyre/list${qs ? `?${qs}` : ""}`);
  },

  /** GET /tyre/:id */
  getById: (id) => request(`tyre/${id}`),

  /** POST /tyre/store  (auth required) */
  create: (data, token) => request("tyre/store", { method: "POST", body: data, token }),

  /** PUT /tyre/:id  (auth required) */
  update: (id, data, token) => request(`tyre/${id}`, { method: "PUT", body: data, token }),

  /** DELETE /tyre/:id  (auth required) */
  remove: (id, token) => request(`tyre/${id}`, { method: "DELETE", token }),
};

// ── Wheel API Module ──────────────────────────────────────────────────────────
const wheelApi = {
  /**
   * GET /wheel
   * @param {object} params - { page, limit, condition, search, shopId }
   */
  getList: (params = {}) => {
    const query = new URLSearchParams();
    if (params.page)      query.set("page",      params.page);
    if (params.limit)     query.set("limit",     params.limit);
    if (params.condition) query.set("condition", params.condition);
    if (params.search)    query.set("search",    params.search);
    if (params.shopId)    query.set("shopId",    params.shopId);
    if (params.minPrice)  query.set("minPrice",  params.minPrice);
    if (params.maxPrice)  query.set("maxPrice",  params.maxPrice);

    const qs = query.toString();
    return request(`wheel${qs ? `?${qs}` : ""}`);
  },

  /** GET /wheel/:id */
  getById: (id) => request(`wheel/${id}`),

  /** POST /wheel/store  (auth required) */
  create: (data, token) => request("wheel/store", { method: "POST", body: data, token }),

  /** PUT /wheel/:id  (auth required) */
  update: (id, data, token) => request(`wheel/${id}`, { method: "PUT", body: data, token }),

  /** DELETE /wheel/:id  (auth required) */
  remove: (id, token) => request(`wheel/${id}`, { method: "DELETE", token }),
};

// ── Car API Module ───────────────────────────────────────────────────────────
const carApi = {
  /**
   * GET /vehicle?type=car
   * @param {object} params - { page, limit, condition, search }
   */
  getList: (params = {}) => {
    const query = new URLSearchParams();
    query.set("type", "car");
    if (params.page)      query.set("page",      params.page);
    if (params.limit)     query.set("limit",     params.limit);
    if (params.condition) query.set("condition", params.condition);
    if (params.search)    query.set("search",    params.search);

    const qs = query.toString();
    return request(`vehicle${qs ? `?${qs}` : ""}`);
  },

  /** GET /vehicle/:id */
  getById: (id) => request(`vehicle/${id}`),

  /** POST /vehicle/store  (auth required) */
  create: (data, token) => request("vehicle/store", { method: "POST", body: data, token }),

  /** PUT /vehicle/:id  (auth required) */
  update: (id, data, token) => request(`vehicle/${id}`, { method: "PUT", body: data, token }),

  /** DELETE /vehicle/:id  (auth required) */
  remove: (id, token) => request(`vehicle/${id}`, { method: "DELETE", token }),
};

// ── Bike API Module ──────────────────────────────────────────────────────────
const bikeApi = {
  /**
   * GET /vehicle?type=bike
   * @param {object} params - { page, limit, condition, search }
   */
  getList: (params = {}) => {
    const query = new URLSearchParams();
    query.set("type", "bike");
    if (params.page)      query.set("page",      params.page);
    if (params.limit)     query.set("limit",     params.limit);
    if (params.condition) query.set("condition", params.condition);
    if (params.search)    query.set("search",    params.search);

    const qs = query.toString();
    return request(`vehicle${qs ? `?${qs}` : ""}`);
  },

  /** GET /vehicle/:id */
  getById: (id) => request(`vehicle/${id}`),

  /** POST /vehicle/store  (auth required) */
  create: (data, token) => request("vehicle/store", { method: "POST", body: data, token }),

  /** PUT /vehicle/:id  (auth required) */
  update: (id, data, token) => request(`vehicle/${id}`, { method: "PUT", body: data, token }),

  /** DELETE /vehicle/:id  (auth required) */
  remove: (id, token) => request(`vehicle/${id}`, { method: "DELETE", token }),
};

// ── Order API Module ──────────────────────────────────────────────────────────
const orderApi = {
  /** POST /order/store  (auth required) */
  create: (data, token) => request("order/store", { method: "POST", body: data, token }),

  /** GET /order/list  (auth required) */
  getList: (token) => request("order/list", { token }),
};

// ── Auth API Module ───────────────────────────────────────────────────────────
const authApi = {
  login:    (credentials) => request("auth/login",    { method: "POST", body: credentials }),
  register: (userData)    => request("auth/register", { method: "POST", body: userData }),
  logout:   (token)       => request("auth/logout",   { method: "POST", token }),
};

// ── Search API Module ────────────────────────────────────────────────────────
const searchApi = {
  /**
   * GET /search?type=all&search=<query>
   * Returns vehicles, tyres, wheels, rims based on search query
   * @param {object} params - { type, search }
   */
  search: (params = {}) => {
    const query = new URLSearchParams();
    if (params.type)   query.set("type",   params.type || "all");
    if (params.search) query.set("search", params.search);

    const qs = query.toString();
    return request(`search${qs ? `?${qs}` : ""}`);
  },
};

// ── Default Export ────────────────────────────────────────────────────────────
const ApiProvider = {
  tyres:  tyreApi,
  wheels: wheelApi,
  cars:   carApi,
  bikes:  bikeApi,
  orders: orderApi,
  auth:   authApi,
  search: searchApi,
};

export default ApiProvider;