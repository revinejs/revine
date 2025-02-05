export async function loadUserConfig() {
  try {
    // relative path to the user's revine.config.ts
    const configModule = await import("../../../revine.config.ts");
    return configModule.default || {};
  } catch (error) {
    console.error(
      "[Revine] Could not load revine.config.ts, using defaults.",
      error
    );
    return {};
  }
}
