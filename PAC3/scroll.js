var filterNodesByName = (nodes, name) => nodes.filter(node => node.getAttribute('name')==name);

var getNodeCountOverMid = (nodes) => {
    const vh = window.innerHeight
    return nodes.map(node => node.getBoundingClientRect())
                .map(dim => dim.top)
                .filter(t => t < vh / 2)
                .length
    }

var eventObservable = rxjs.fromEvent(window, 'scroll')
            .pipe(rxjs.map(() => d3.selectAll('.scroll').nodes()))

var getScrollAction = (name) => {
    return eventObservable.pipe(
        rxjs.filter(nodes => filterNodesByName(nodes, name)),
        rxjs.map(nodes => ({count: getNodeCountOverMid(nodes), nodes})),
        rxjs.distinctUntilKeyChanged('count')
    )
}