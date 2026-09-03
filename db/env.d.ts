declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    OPENAI_API_KEY?: string;
    OPENAI_ANSWER_MODEL?: string;
    OPENAI_EMBEDDING_MODEL?: string;
    HOST_CODE?: string;
  }
}
