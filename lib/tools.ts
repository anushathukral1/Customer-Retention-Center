import accountsJson from "./mockAccounts.json";

export type AccountProfile = {
  account_id: string;
  name: string;
  domain: string;
  mrr: number;
  user_growth_pct: number;
  last_exec_touch_days: number;
  feature_adoption_score: number;
  open_support_tickets: number;
};

export type RenewalForecast = {
  renewal_probability: number;
  risk_level: "Low" | "Medium" | "High";
  primary_risks: string[];
};

export type StrategyOutput = {
  recommended_actions: string[];
  urgency: "Low" | "Medium" | "High";
  expansion_potential: "Low" | "Moderate" | "High";
};

const accounts = accountsJson as unknown as AccountProfile[];

/**
 * TOOL 1: get_account_profile
 * Look up by company name OR domain (case-insensitive).
 */
export function getAccountProfile(query: string): AccountProfile | null {
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return null;

  // Normalize domain-like inputs (strip protocol, path, www)
  const normalized = q
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .replace(/^www\./, "");

  // Strong match: exact domain
  const byDomain = accounts.find(
    (a) => a.domain.toLowerCase() === normalized
  );
  if (byDomain) return byDomain;

  // Exact name
  const byName = accounts.find((a) => a.name.toLowerCase() === normalized);
  if (byName) return byName;

  // Demo-friendly: "contains" match
  const byContains = accounts.find((a) =>
    a.name.toLowerCase().includes(normalized)
  );
  return byContains || null;
}

/**
 * TOOL 2: forecast_renewal
 * Simple heuristic scoring model (fast + demo-friendly)
 */
export function forecastRenewal(input: {
  mrr: number;
  user_growth_pct: number;
  last_exec_touch_days?: number;
  feature_adoption_score?: number;
  open_support_tickets?: number;
}): RenewalForecast {
  let score = 80;
  const risks: string[] = [];

  const userGrowth = input.user_growth_pct ?? 0;
  const execTouch = input.last_exec_touch_days ?? 999;
  const adoption = input.feature_adoption_score ?? 50;
  const tickets = input.open_support_tickets ?? 0;

  if (userGrowth < 0) {
    score -= 15;
    risks.push("Declining user growth");
  }

  if (execTouch > 90) {
    score -= 10;
    risks.push("Lack of recent executive engagement");
  }

  if (adoption < 70) {
    score -= 10;
    risks.push("Weak feature adoption");
  }

  if (tickets > 5) {
    score -= 5;
    risks.push("Elevated support ticket volume");
  }

  score = Math.max(5, Math.min(95, score));

  let risk_level: "Low" | "Medium" | "High" = "Low";
  if (score < 60) risk_level = "High";
  else if (score < 75) risk_level = "Medium";

  return {
    renewal_probability: score,
    risk_level,
    primary_risks: risks.length ? risks : ["No major risk signals detected"]
  };
}

/**
 * TOOL 3: generate_strategy
 */
export function generateStrategy(forecast: {
  renewal_probability: number;
  risk_level?: string;
  primary_risks?: string[];
}): StrategyOutput {
  const prob = forecast.renewal_probability ?? 0;

  const actions: string[] = [];

  if (prob < 60) {
    actions.push(
      "Schedule executive alignment call within 7 days",
      "Run targeted adoption workshop for power users",
      "Create a time-bound success plan with weekly health checkpoints"
    );
  } else if (prob < 75) {
    actions.push(
      "Increase stakeholder touchpoints (reconfirm success criteria + timeline)",
      "Drive adoption of 1–2 underutilized high-value features",
      "Proactively address open tickets and document mitigations"
    );
  } else {
    actions.push(
      "Confirm renewal plan early and explore multi-year options",
      "Identify expansion motion tied to measurable outcomes",
      "Launch advocacy: case study, quote, or reference call"
    );
  }

  return {
    recommended_actions: actions,
    urgency: prob < 60 ? "High" : prob < 75 ? "Medium" : "Low",
    expansion_potential: prob > 75 ? "High" : "Moderate"
  };
}