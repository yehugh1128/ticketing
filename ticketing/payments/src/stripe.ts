import Stripe from "stripe";

//process.env.STRIPE_KEY
export const stripe = new Stripe('sk_test_51OMpR1HqWN9TbtpWbzsqavAFSxI94WskDChqH0fhvazWbIrQix8f1m8UCh4575UyIxOmvgJuUZZDgyZv3pZVdJNp00FHhJVy1g', {
    apiVersion:'2023-10-16'
});