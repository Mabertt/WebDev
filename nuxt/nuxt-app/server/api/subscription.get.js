export default defineEventHandler(async (event) => {
  try {
    const data = {
      plan: {
        id: 'team-annual',
        name: 'Team - Annual',
        billingPeriod: 'yearly',
        monthlyPrice: 207.50,
        yearlyPrice: 2490.00,
        originalYearlyPrice: 2988.00,
        savings: 498.00,
        features: [
          { text: 'Primary user + 2 free team members', subtext: '(extra team members for $25/month)' },
          { text: 'Save unlimited properties' },
          { text: '50,000 exports', subtext: '(additional exports at $0.01 each)' },
          { text: '1,000 free skip traces', subtext: '(additional skip tracing at $0.08 each)' },
          { text: 'Imports $0.01' },
          { text: 'FREE daily product trainings and support' },
          { text: 'Full suite of next-gen investing tools' },
          { text: 'Industry first AI powered comp tool' },
          { text: 'Includes dedicated support agent' }
        ]
      },
      trialDays: 3,
      termsUrl: '/terms-of-use',
      supportPhone: '(888) 463-3163'
    };

    return data;
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch subscription data'
    });
  }
});
