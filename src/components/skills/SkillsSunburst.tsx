'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface SubSkill { name: string; level: number }
interface SkillDomain { id: string; domain: string; color: string; sub_skills: SubSkill[] }

interface Props { skills: SkillDomain[] }

export function SkillsSunburst({ skills }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; level: number } | null>(null)

  useEffect(() => {
    if (!svgRef.current || !skills.length) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const size = 520
    const radius = size / 2
    svg.attr('viewBox', `0 0 ${size} ${size}`)

    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`)

    const data = {
      name: 'root',
      children: skills.map((domain) => ({
        name: domain.domain,
        color: domain.color || '#6366f1',
        children: (domain.sub_skills ?? []).map((s) => ({
          name: s.name,
          value: Math.max(1, s.level),
          level: s.level,
          color: domain.color || '#6366f1',
        })),
      })),
    }

    const root = d3.hierarchy(data).sum((d: any) => d.value ?? 0)
    const partition = d3.partition<any>().size([2 * Math.PI, radius])
    partition(root)

    const arc = d3.arc<any>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => Math.sqrt(d.y0) * 0.85)
      .outerRadius((d) => Math.sqrt(d.y1) * 0.85 - 2)

    const paths = g.selectAll('path')
      .data(root.descendants().filter((d) => d.depth > 0))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d: any) => {
        const color = d3.color(d.data.color || '#6366f1')!
        if (d.depth === 1) return color.toString()
        const opacity = 0.4 + (d.data.level ?? 3) * 0.1
        return d3.color(d.data.color || '#6366f1')!.copy({ opacity }) as any
      })
      .attr('stroke', 'rgba(0,0,0,0.15)')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s')

    paths
      .on('mouseenter', function (event, d: any) {
        d3.select(this).style('opacity', 0.85)
        const [mx, my] = d3.pointer(event, svgRef.current)
        setTooltip({ x: mx, y: my, name: d.data.name, level: d.data.level ?? 0 })
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, svgRef.current)
        setTooltip((t) => t ? { ...t, x: mx, y: my } : null)
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', 1)
        setTooltip(null)
      })

    // Domain labels
    g.selectAll('text.domain-label')
      .data(root.descendants().filter((d) => d.depth === 1))
      .join('text')
      .attr('class', 'domain-label')
      .attr('transform', (d: any) => {
        const angle = (d.x0 + d.x1) / 2
        const r = (Math.sqrt(d.y0) + Math.sqrt(d.y1)) / 2 * 0.85
        const x = Math.sin(angle) * r
        const y = -Math.cos(angle) * r
        return `translate(${x},${y}) rotate(${(angle * 180 / Math.PI) - 90})`
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .text((d: any) => d.data.name.length > 12 ? d.data.name.substring(0, 11) + '…' : d.data.name)

    // Center circle
    g.append('circle')
      .attr('r', Math.sqrt((root as any).y0 ?? 0) * 0.85 * 0.95)
      .attr('fill', 'rgba(255,255,255,0.03)')
      .attr('stroke', 'rgba(255,255,255,0.1)')

    // Center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('font-size', '13px')
      .attr('fill', 'rgba(255,255,255,0.5)')
      .text('Skills')
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('font-size', '10px')
      .attr('fill', 'rgba(255,255,255,0.3)')
      .text('hover to explore')

  }, [skills])

  return (
    <div className="relative flex justify-center">
      <svg ref={svgRef} className="w-full max-w-[520px] h-auto" />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-20 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 text-sm shadow-xl"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <p className="text-white font-medium">{tooltip.name}</p>
          {tooltip.level > 0 && (
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map((n) => (
                <div key={n} className={`w-3 h-1.5 rounded-full ${n <= tooltip.level ? 'bg-primary' : 'bg-white/20'}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
