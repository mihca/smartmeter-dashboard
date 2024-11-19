export function findProvider(providers, sample) {

    for (var idx = 0; idx < providers.length; idx++) {
        var provider = providers[idx];
        if (probe(provider, sample)) {
            return provider;
        }
    }

    console.log("sample: ", sample);
    return null;
}

function probe (provider, sample) {
    if (provider.description === "Netz NÖ Verbrauch 2")
        return provider;
}
