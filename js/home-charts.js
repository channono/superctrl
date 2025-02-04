// Homepage Charts
document.addEventListener('DOMContentLoaded', function() {
    // Business Distribution Chart (Horizontal Bar)
    const distributionCtx = document.getElementById('businessDistributionChart');
    if (distributionCtx) {
        new Chart(distributionCtx, {
            type: 'bar',
            data: {
                labels: [
                    i18next.t('businessOverview.regions.asiaPacific'),
                    i18next.t('businessOverview.regions.europe'),
                    i18next.t('businessOverview.regions.northAmerica'),
                    i18next.t('businessOverview.regions.others')
                ],
                datasets: [{
                    data: [35, 30, 20, 15],
                    backgroundColor: [
                        'rgb(66, 99, 235)',  // Blue for Asia Pacific
                        'rgb(39, 174, 96)',  // Green for Europe
                        'rgb(0, 184, 217)',  // Cyan for North America
                        'rgb(255, 159, 0)'   // Orange for Others
                    ],
                    borderWidth: 0,
                    borderRadius: 4,
                    barThickness: 20,
                    maxBarThickness: 25
                }]
            },
            options: {
                indexAxis: 'y',  // This makes the bars horizontal
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '% Market Share';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 40,
                        grid: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Business Performance Chart (Line)
    const performanceCtx = document.getElementById('businessPerformanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
                datasets: [
                    {
                        label: i18next.t('businessOverview.regions.asiaPacific'),
                        data: [30, 35, 45, 55, 65, 75],
                        backgroundColor: 'rgba(66, 99, 235, 0.2)',
                        borderColor: 'rgb(66, 99, 235)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: i18next.t('businessOverview.regions.europe'),
                        data: [40, 45, 50, 60, 70, 80],
                        backgroundColor: 'rgba(39, 174, 96, 0.2)',
                        borderColor: 'rgb(39, 174, 96)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: i18next.t('businessOverview.regions.northAmerica'),
                        data: [20, 25, 35, 45, 55, 65],
                        backgroundColor: 'rgba(0, 184, 217, 0.2)',
                        borderColor: 'rgb(0, 184, 217)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: i18next.t('businessOverview.regions.others'),
                        data: [15, 20, 30, 40, 50, 60],
                        backgroundColor: 'rgba(255, 159, 0, 0.2)',
                        borderColor: 'rgb(255, 159, 0)',
                        borderWidth: 2,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
});

// Update charts when language changes
i18next.on('languageChanged', function() {
    // Remove old charts
    const distributionCtx = document.getElementById('businessDistributionChart');
    const performanceCtx = document.getElementById('businessPerformanceChart');
    if (distributionCtx) {
        Chart.getChart(distributionCtx)?.destroy();
    }
    if (performanceCtx) {
        Chart.getChart(performanceCtx)?.destroy();
    }
    
    // Reinitialize charts with new language
    document.dispatchEvent(new Event('DOMContentLoaded'));
});
