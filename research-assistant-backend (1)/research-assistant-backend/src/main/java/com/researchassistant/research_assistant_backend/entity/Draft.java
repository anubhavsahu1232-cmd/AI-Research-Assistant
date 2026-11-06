package com.researchassistant.research_assistant_backend.entity;
import jakarta.persistence.*; import java.time.LocalDateTime; import java.util.ArrayList; import java.util.List;
@Entity @Table(name="research_drafts")
public class Draft {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(nullable=false) private String title;
 @Column(name="created_at",insertable=false,updatable=false) private LocalDateTime createdAt;
 @Column(name="last_updated_at",insertable=false,updatable=false) private LocalDateTime updatedAt;
 @OneToMany(mappedBy="draft",cascade=CascadeType.ALL,orphanRemoval=true,fetch=FetchType.EAGER) private List<DraftSection> sections=new ArrayList<>();
 @Transient private String topic; @Transient private String content;
 public Draft(){}
 public void replaceText(String topic,String content){sections.clear(); if(topic!=null&&!topic.isBlank()){DraftSection s=new DraftSection("TOPIC",topic);s.setDraft(this);sections.add(s);} if(content!=null&&!content.isBlank()){DraftSection s=new DraftSection("CONTENT",content);s.setDraft(this);sections.add(s);}}
 public String readTopic(){return sections.stream().filter(s->"TOPIC".equals(s.getSectionName())).map(DraftSection::getContent).findFirst().orElse("");}
 public String readContent(){return sections.stream().filter(s->!"TOPIC".equals(s.getSectionName())).map(s->s.getContent()==null?"":s.getContent()).reduce((a,b)->a+"\n\n"+b).orElse("");}
 public Long getId(){return id;} public void setId(Long v){id=v;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getTopic(){return topic==null?readTopic():topic;} public void setTopic(String v){topic=v;}
 public String getContent(){return content==null?readContent():content;} public void setContent(String v){content=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;} public LocalDateTime getUpdatedAt(){return updatedAt;} public void setUpdatedAt(LocalDateTime v){updatedAt=v;}
 public List<DraftSection> getSections(){return sections;} public void setSections(List<DraftSection> v){sections=v;}
 @PrePersist @PreUpdate private void syncSections(){if(topic!=null||content!=null)replaceText(topic,content);}
}
