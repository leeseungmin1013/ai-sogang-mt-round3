declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    OPENAI_API_KEY?: string;
    OPENAI_ANSWER_MODEL?: string;
    HOST_CODE?: string;
  }
}
