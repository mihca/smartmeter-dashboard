export function findProvider(providers, sample) {

    for (let i = 0; i < providers.length; i++) {
        let provider = providers[i];
        if (provider.match && provider.match(sample) === true)
            return provider;
    }

    return null;
}
