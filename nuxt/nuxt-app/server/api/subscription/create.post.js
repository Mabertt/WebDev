export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.consent) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You must consent to the Terms of Use'
      });
    }

    if (!body.cardNumber || !body.expiryDate || !body.cvc || !body.fullName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All billing fields are required'
      });
    }

    const subscriptionId = `sub_${Date.now()}`;
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 3);

    return {
      success: true,
      subscriptionId,
      message: 'Subscription created successfully. Your 3-day free trial has started.',
      trialEndDate: trialEndDate.toISOString()
    };
  }
  catch (error) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create subscription'
    });
  }
});
