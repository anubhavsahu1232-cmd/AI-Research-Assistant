package com.researchassistant.research_assistant_backend.entity;
import jakarta.persistence.*;
@Entity @Table(name="draft_sections")
public class DraftSection {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="draft_id",nullable=false) private Draft draft;
 @Column(name="section_name",length=100) private String sectionName;
 @Column(columnDefinition="TEXT") private String content;
 public DraftSection(){} public DraftSection(String n,String c){sectionName=n;content=c;}
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public Draft getDraft(){return draft;} public void setDraft(Draft v){draft=v;}
 public String getSectionName(){return sectionName;} public void setSectionName(String v){sectionName=v;}
 public String getContent(){return content;} public void setContent(String v){content=v;}
}
