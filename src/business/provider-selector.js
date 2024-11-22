export function findProvider(providers, sample) {

    providers.forEach((provider) => {
        console.log(provider);
        console.log(sample);
        if (provider.match && provider.match(sample))
            return provider;
    })

    console.log("sample: <", sample, ">");
    return null;
}
